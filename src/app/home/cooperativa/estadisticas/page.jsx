'use client'
import { I18nProvider } from "@react-aria/i18n";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Card, CardBody,
  Table, TableHeader, TableBody, TableRow, TableCell, Button,
  TableColumn, Pagination, Select, SelectItem, Input, DateRangePicker,
  DatePicker
 } from '@nextui-org/react';
import { typeOfReportsCoop } from '@constants/statsReports';
import GreenRoundedButton from "@/components/greenRoundedButton";
import { ToastNotifier } from "@/components/ToastNotifier";
import { get_stats_reports, getUserById } from '@api/apiService';
import { ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";
import PieChart from "@/components/PieChart";
import { mapMaterialNameToLabel } from "@/constants/recyclables";
import { mapRequestStatus } from "@/constants/request";
import BarChart from "@/components/BarChart";
import { parseDate } from "@internationalized/date";

const estadisticasCooperativa = () => {
  const router = useRouter();
  const userSession = useSelector((state) => state.userSession);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [selectedTypeReport, setSelectedTypeReport] = useState(null);
  const [responseTypeReport, setResponseTypeReport] = useState(null);

  const [responseStats, setResponseStats] = useState(null);

  const hasError = () => {
    if (!dateFrom || !dateTo || !selectedTypeReport) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    const retrieveData = async () => {
      try {
          const response = await getUserById(userSession.userId);
          setUserInfo(response);
      } catch (error) {
          console.error('Error retrieving user data:', error);
          ToastNotifier.error('Error al obtener la información del usuario');
      } finally {
          setLoading(false);
      }
    };
    retrieveData();
  }, []);

  const handleConfirm = async () => {
    if (hasError()) {
      ToastNotifier.error('Por favor, complete todos los campos');
      return;
    }
    const body = {
      fecha_desde : dateFrom.toISOString(),
      fecha_hasta : dateTo.toISOString(),
      tipo_usuario : userInfo.type,
      id_usuario : userInfo.id,
    }
    try {
      setLoading(true);
      const response = await get_stats_reports(selectedTypeReport, body);
      processStats(response.data);
    } catch (error) {
      console.error('Error retrieving stats:', error);
      ToastNotifier.error('Error al obtener las estadísticas');
    } finally {
      setLoading(false);
    }
  }

  const processStats = (response) => {
    switch (selectedTypeReport) {
      case 'WastebyType':
        const processed = Object.entries(response).reduce((acc, [key, value]) => {
          const newKey = mapMaterialNameToLabel[key] || key;
          acc[newKey] = value;
          return acc;
        }, {});
        setResponseStats(processed);
        setResponseTypeReport('WastebyType');
        break;
      case 'WastebyStatus':
        const processedStatus = Object.entries(response).reduce((acc, [key, value]) => {
          const newKey = mapRequestStatus[key] || key;
          acc[newKey] = value;
          return acc;
        }, {});
        setResponseStats(processedStatus);
        setResponseTypeReport('WastebyStatus');
        break;
      case 'WastebyDay':
        const processedDay = Object.entries(response).reduce((acc, [key, value]) => {
          const newKey = key.charAt(0).toUpperCase() + key.slice(1);
          acc[newKey] = value;
          return acc;
        }, {});
        setResponseStats(processedDay);
        setResponseTypeReport('WastebyDay');
        break;
      default:
        break;
    };
  };

  return (
    <div className='flex flex-col py-1 px-2 lg:p-4 h-screen'>
      <ToastContainer />
      <h1 className='text-2xl font-bold'>Estadísticas de la cooperativa</h1>

      {loading ? (
        <Spinner /> ): (
      <div className='flex flex-col mx-4 my-4 gap-2'>
        <Card className='flex rounded-md'>
          <CardBody>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <I18nProvider locale="es-GB">
              <DatePicker
                label="Desde"
                placeholder="Seleccione una fecha"
                onChange={(e) => setDateFrom(new Date(e.year, e.month - 1, e.day))}
                value={dateFrom ? parseDate(dateFrom.toISOString().split('T')[0])  : null}
              />
            </I18nProvider>

            <I18nProvider locale="es-GB">
              <DatePicker
                label="Hasta"
                placeholder="Seleccione una fecha"
                onChange={(e) => setDateTo(new Date(e.year, e.month - 1, e.day))}
                value={dateTo ? parseDate(dateTo.toISOString().split('T')[0])  : null}
              />
            </I18nProvider>

            <Select 
              label="Tipo de reporte" 
              selectedKeys={[selectedTypeReport]}
              onChange={(e) => setSelectedTypeReport(e.target.value)}
            >
              {typeOfReportsCoop.map((report) => (
                <SelectItem key={report.key}>
                  {report.label}
                </SelectItem>
              ))}
            </Select>

            <GreenRoundedButton
              onClick={handleConfirm}
              buttonTitle="Generar"

            />
          </div>
          </CardBody>
        </Card>

        { responseStats && responseTypeReport && responseTypeReport === 'WastebyType' && (
          <div className='flex flex-col gap-2'>
            <h2 className='text-xl font-bold'>Cantidad de residuos recibidos por cada tipo</h2>
            <div className="flex flex-col md:flex-row gap-2">
              <Table>
                <TableHeader>
                  <TableColumn>Tipo de residuo</TableColumn>
                  <TableColumn>Cantidad [kg]</TableColumn>
                </TableHeader>
                <TableBody>
                  {Object.keys(responseStats).map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{responseStats[key]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className='md:w-1/2 justify-center'>
                <PieChart data={responseStats} label="Kilogramos" />
              </div>
            </div>
          </div>
        )
        }

        { responseStats && responseTypeReport && responseTypeReport === 'WastebyStatus' && (
          <div className='flex flex-col gap-2'>
            <h2 className='text-xl font-bold'>Cantidad de recolecciones recibidas y sus diferentes estados</h2>
            <div className="flex flex-col md:flex-row gap-2">
              <Table>
                <TableHeader>
                  <TableColumn>Estado</TableColumn>
                  <TableColumn>Cantidad de solicitudes</TableColumn>
                </TableHeader>
                <TableBody>
                  {Object.keys(responseStats).map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{responseStats[key]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className='md:w-1/2 justify-center'>
                <PieChart data={responseStats} label="Solicitudes"/>
              </div>
            </div>
          </div>
        )
        }

        { responseStats && responseTypeReport && responseTypeReport === 'WastebyDay' && (
          <div className='flex flex-col gap-2'>
            <h2 className='text-xl font-bold'>Cantidad de residuos recibidos por dia de la semana</h2>
            <div className="flex flex-col md:flex-row gap-2">
              <Table>
                <TableHeader>
                  <TableColumn>Dia de la semana</TableColumn>
                  <TableColumn>Cantidad de residuos</TableColumn>
                </TableHeader>
                <TableBody>
                  {Object.keys(responseStats).map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{responseStats[key]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className='md:w-1/2 justify-center'>
                <BarChart data={responseStats} label="Kilogramos" />
              </div>
            </div>
          </div>
        )
        }


    </div>
    )}
  </div>
  );
};

export default estadisticasCooperativa;
