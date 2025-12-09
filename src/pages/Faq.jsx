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
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'O que é este projeto?',
      answer:
        'Este é um projeto de adoção responsável de animais que conecta pets resgatados a famílias que desejam adotar. Nossa plataforma facilita o processo de adoção, tornando-o mais acessível e transparente para todos os envolvidos.',
    },
    {
      question: 'Como funciona o processo de adoção?',
      answer:
        'O processo é simples: navegue pelos animais disponíveis, utilize os filtros para encontrar o pet ideal, visualize os detalhes do animal e solicite a adoção através do botão "Adotar". Nossa equipe entrará em contato para dar continuidade ao processo, que inclui entrevista, visita e documentação necessária.',
    },
    {
      question: 'Quais informações posso encontrar sobre os animais?',
      answer:
        'Para cada animal, fornecemos informações detalhadas como: nome, idade aproximada, porte, sexo, espécie, temperamento, se é castrado, vacinado, histórico de saúde e uma descrição completa da personalidade do pet. Também incluímos fotos para você conhecer melhor seu futuro companheiro.',
    },
    {
      question: 'Posso filtrar os animais por características específicas?',
      answer:
        'Sim! Nossa plataforma oferece diversos filtros: nome, espécie (cão ou gato), porte (pequeno, médio, grande), faixa etária (filhote, adulto, idoso), sexo, temperamento, se é castrado e vacinado. Isso facilita encontrar o pet que melhor se adequa ao seu estilo de vida.',
    },
    {
      question: 'Todos os animais são castrados e vacinados?',
      answer:
        'Não necessariamente. Cada animal tem seu histórico individual. Alguns já foram castrados e vacinados, outros podem estar em processo. Todas essas informações estão claramente indicadas no perfil de cada pet para sua total transparência.',
    },
    {
      question: 'Há algum custo para adotar?',
      answer:
        'A adoção em si é gratuita, porém pode haver uma taxa simbólica de adoção que ajuda a cobrir custos com vacinação, castração e cuidados veterinários que o animal recebeu. Os valores e condições são informados durante o processo de adoção.',
    },
    {
      question: 'Posso adotar se moro em apartamento?',
      answer:
        'Sim! Muitos animais se adaptam muito bem a apartamentos. O importante é escolher um pet compatível com seu espaço e estilo de vida. Use nossos filtros de porte e temperamento para encontrar o animal ideal para sua moradia.',
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
    {
      question: 'Como posso ajudar se não posso adotar agora?',
      answer:
        'Há várias formas de ajudar: seja um lar temporário, faça doações, divulgue nossos animais em suas redes sociais, seja voluntário em eventos, ou contribua com ração e suprimentos. Toda ajuda faz diferença na vida desses animais!',
    },
    {
      question: 'Os animais têm algum problema de saúde?',
      answer:
        'Cada animal passa por avaliação veterinária. Se houver alguma condição de saúde especial ou necessidade de cuidados específicos, isso estará claramente informado no perfil do pet. Acreditamos na transparência total sobre o histórico de saúde dos nossos animais.',
    },
    {
      question: 'Como é feito o acompanhamento pós-adoção?',
      answer:
        'Após a adoção, mantemos contato para saber como está a adaptação do pet. Realizamos visitas de acompanhamento e estamos sempre disponíveis para tirar dúvidas e oferecer suporte. O bem-estar do animal e a felicidade do adotante são nossas prioridades.',
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

        <div className="mt-10 bg-blue-100 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Ainda tem dúvidas?
          </h2>
          <p className="text-gray-600 mb-4">
            Entre em contato conosco! Estamos aqui para ajudar você a encontrar
            seu novo melhor amigo.
          </p>
          <a
            href="mailto:equiperecpet@gmail.com"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Entrar em Contato
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
