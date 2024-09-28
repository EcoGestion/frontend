import React, { useState, useEffect } from "react";
import barrios from '@/constants/zones';
import {Select, SelectItem} from "@nextui-org/react";
import "@styles/app_forms.css"
import "@styles/app_buttons.css"

const AddressForm = ({
  isDisabled = true,
  address = {street:'', number:'', zone:'', city:'', province:'', zip_code:0},
  setAddress,
  }) => {

  return (
    <div>

    <form className="form-container">
      <div>
        <label htmlFor="street">Calle</label>
        <input
          type="text"
          id="street"
          name="street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          disabled={isDisabled}
          className={isDisabled ? 'disabled-input' : ''}
        />
      </div>
      <div>
        <label htmlFor="number">Número</label>
        <input
          type="text"
          id="number"
          name="number"
          value={address.number}
          onChange={(e) => setAddress({ ...address, number: e.target.value })}
          disabled={isDisabled}
          className={isDisabled ? 'disabled-input' : ''}
        />
      </div>
      <div>
        <label htmlFor="city">Ciudad</label>
        <input
          type="text"
          id="city"
          name="city"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          disabled={isDisabled}
          className={isDisabled ? 'disabled-input' : ''}
        />
      </div>

      <div className="">
        <label htmlFor="barrio" className="block text-sm font-medium leading-6 text-gray-900">
          Barrio
        </label>
        <div className="mt-2">
          <Select
            value={address.zone}
            onChange={(e) => setAddress({ ...address, zone: e.target.value })}
            placeholder="Seleccione un barrio"
            isDisabled={isDisabled}
          >
            {barrios.map((barrio) => (
              <SelectItem key={barrio} value={barrio}>
                {barrio}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="province">Provincia</label>
        <input
          type="text"
          id="province"
          name="province"
          value={address.province}
          onChange={(e) => setAddress({ ...address, province: e.target.value })}
          disabled={isDisabled}
          className={isDisabled ? 'disabled-input' : ''}
        />
      </div>
      <div>
        <label htmlFor="zip">Código Postal</label>
        <input
          type="number"
          id="zip"
          name="zip_code"
          value={address.zip_code}
          onChange={(e) => setAddress({ ...address, zip_code: Number(e.target.value) })}
          disabled={isDisabled}
          className={isDisabled ? 'disabled-input' : ''}
        />
      </div>
    </form>

    </div>
  )
}

export default AddressForm;