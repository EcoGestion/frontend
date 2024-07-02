// GREEN ROUNDED BUTTON

const GreenRoundedButton = ({ onClick, buttonTitle }) => {
    return (
        <button
            className="bg-[rgb(63,131,62)] hover:bg-[rgb(94,197,93)] text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300" 
            onClick={onClick}
        >
            {buttonTitle}
        </button>
    );
};

export default GreenRoundedButton;
