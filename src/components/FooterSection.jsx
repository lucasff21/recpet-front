import { Link } from "react-router-dom";

const FooterSection = ({ title, items, text }) => {
    return (
        <div className="max-w-xs">
            <h3 className="font-semibold text-base text-white">{title}</h3>
            {items ? (
                <ul className={`space-y-2 mt-2 p-0 ${!text && "m-0"}`}>
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.to}
                                className="text-white text-sm no-underline hover:underline"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm mt-2">{text}</p>
            )}
        </div>
    );
};

export default FooterSection;