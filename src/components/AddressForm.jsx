import React, { useState, useEffect } from "react";
import zones from '@/constants/zones';
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";

const AddressForm = ({
  isDisabled = false,
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
          required
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

      <div>
        <label htmlFor="barrio" className="block text-sm font-medium leading-6 text-gray-900">
          Barrio
        </label>
        <div className="mt-2">
          <Autocomplete
            onSelectionChange={(key) => setAddress({ ...address, zone: key })}
            placeholder="Seleccione un barrio"
            isDisabled={isDisabled}
            scrollShadowProps={{ isEnabled: false }}
          >
            {zones.map((barrio) => (
              <AutocompleteItem key={barrio.value} value={barrio.value}>
                {barrio.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
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