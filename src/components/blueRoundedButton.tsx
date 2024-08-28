// BLUE ROUNDED BUTTON

interface BlueRoundedButtonProps {
    onClick?: () => void;
    buttonTitle: string;
    type?: "button" | "submit" | "reset";
}

const BlueRoundedButton: React.FC<BlueRoundedButtonProps> = ({
    onClick = () => {},
    buttonTitle,
    type = 'button',
}) => {
    return (
        <button
            type={type}
            className="bg-blue-dark hover:bg-blue-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300" 
            onClick={onClick}
        >
            {buttonTitle}
        </button>
    );
};

export default BlueRoundedButton;
