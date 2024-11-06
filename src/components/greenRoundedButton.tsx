// GREEN ROUNDED BUTTON

interface GreenRoundedButtonProps {
    onClick?: () => void;
    buttonTitle: string;
    type?: "button" | "submit" | "reset";
}

const GreenRoundedButton: React.FC<GreenRoundedButtonProps> = ({
    onClick = () => {},
    buttonTitle,
    type = 'button',
}) => {
    return (
        <button
            type={type}
            className='bg-white text-green-dark hover:text-green-light border-green-dark hover:border-green-light px-3 py-2 rounded-medium border-medium shadow-md transition duration-300'
            onClick={onClick}
        >
            {buttonTitle}
        </button>
    );
};

export default GreenRoundedButton;
        