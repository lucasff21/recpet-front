import "./style.css";

export const Button = ({ text, onClick, disabled, lightMode = true }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${lightMode ? 'light' : 'dark'} button-default`} >
            {text.toUpperCase()}
        </button>
    )
}