import '../styles/ComponentLayout.css';
import FooterSection from './FooterSection';

const Footer = () => {
  const sections = [
    {
      title: 'Institucional',
      items: [
        { to: '/quem-somos', label: 'Quem somos' },
        { to: '/contato', label: 'Contato' },
      ],
    },
    {
      title: 'Navegação',
      items: [{ to: '/', label: 'Adote' }],
    },
    {
      title: 'Contato',
      text: 'Avenida Milton Santos, s/n - Campus de Ondina, PAF 2 - Salvador - Bahia, CEP 40.170-110',
    },
  ];

  return (
    <footer className="bg-cyan-900 text-white py-3 px-4 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-wrap align-items-baseline md:flex-row justify-between md:items-start space-y-6 md:space-y-0 md:gap-16 md:max-w-[900px]">
        {sections.map((section, index) => (
          <FooterSection
            key={index}
            title={section.title}
            items={section.items}
            text={section.text}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
