const AddressFormat = (address) => {
    return `${address.street} ${address.number}, ${address.city}`;
}

export default AddressFormat;