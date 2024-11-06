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
            className="bg-white border-blue-dark hover:border-blue-light text-blue-dark hover:text-blue-light py-2 px-3 rounded-medium border-medium shadow-md transition duration-300" 
            onClick={onClick}
        >
            {buttonTitle}
        </button>
    );
};

export default BlueRoundedButton;
