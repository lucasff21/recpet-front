import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FaqItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-semibold text-gray-800 text-base md:text-lg pr-4">
          {question}
        </span>
        {isOpen ? (
          <FiChevronUp className="text-blue-600 flex-shrink-0 w-5 h-5" />
        ) : (
          <FiChevronDown className="text-gray-400 flex-shrink-0 w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">{answer}</div>
      )}
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'Como funciona o processo de adoção?',
      answer:
        'O processo é simples: navegue pelos animais disponíveis, utilize os filtros para encontrar o pet ideal, visualize os detalhes do animal e solicite a adoção através do botão "Adotar". Nossa equipe entrará em contato para dar continuidade ao processo, que inclui entrevista, visita e documentação necessária.',
    },
    {
      question: 'Há algum custo para adotar?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
    },
    {
      question: 'O que preciso para adotar?',
      answer:
        'Você precisa ser maior de 18 anos, ter um lar estável, condições de cuidar do animal, e estar disposto a assumir a responsabilidade por toda a vida do pet. Durante o processo, solicitaremos documentos de identificação e realizaremos uma entrevista para garantir o bem-estar do animal.',
    },
    {
      question: 'Posso devolver o animal se não me adaptar?',
      answer:
        'Adoção é um compromisso de longo prazo. No entanto, entendemos que situações excepcionais podem ocorrer. Se houver problemas de adaptação, entre em contato conosco imediatamente. Oferecemos suporte e orientação, e em último caso, podemos receber o animal de volta.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout>
      <div className="pt-[80px] px-4 max-w-4xl mx-auto w-full sm:px-6 md:pt-6 pb-16">
        <div className="bg-blue-50 p-8 rounded-lg mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            Perguntas Frequentes
          </h1>
          <p className="text-center text-gray-600 text-base md:text-lg">
            Encontre respostas para as dúvidas mais comuns sobre nosso projeto
            de adoção responsável
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggleFaq(index)}
            />
          ))}
        </div>

        {/*<div className="mt-10 bg-blue-100 p-6 rounded-lg text-center">*/}
        {/*  <h2 className="text-xl font-bold text-gray-800 mb-3">*/}
        {/*    Ainda tem dúvidas?*/}
        {/*  </h2>*/}
        {/*  <p className="text-gray-600 mb-4">*/}
        {/*    Entre em contato conosco! Estamos aqui para ajudar você a encontrar*/}
        {/*    seu novo melhor amigo.*/}
        {/*  </p>*/}
        {/*  <a*/}
        {/*    href="mailto:equiperecpet@gmail.com"*/}
        {/*    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"*/}
        {/*  >*/}
        {/*    Entrar em Contato*/}
        {/*  </a>*/}
        {/*</div>*/}
      </div>
    </Layout>
  );
};

export default Faq;
