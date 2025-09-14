import Layout from '../components/Layout';

const Contact = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Contato
        </h1>
        <div className="flex flex-col gap-2 text-gray-700">
          <p>
            <span className="font-bold">📍 Endereço:</span> Avenida Milton
            Santos, s/n - Campus de Ondina, PAF 2 - Salvador - Bahia, CEP
            40.170-110
          </p>
          <p>
            <span className="font-bold">📞 Telefone:</span>{' '}
            <a
              href="https://wa.me/551199999999"
              className="text-orange-500 hover:text-orange-600"
              target="_blank"
              rel="noreferrer"
            >
              (11) 99999-9999
            </a>
          </p>
          <p>
            <span className="font-bold">✉️ E-mail:</span>{' '}
            <a
              href="mailto:contato@empresa.com"
              className="text-orange-500 hover:text-orange-600"
              target="_blank"
              rel="noreferrer"
            >
              contato@example.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
