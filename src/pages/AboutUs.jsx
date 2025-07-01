import Layout from '../components/Layout';

const AboutUs = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Quem somos
        </h1>
        <p className="text-sm text-gray-600 text-center">
          "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit..."
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra
          diam at nunc sagittis volutpat et at nisl. Mauris dictum, nulla sit
          amet varius tristique, mauris lectus tristique sapien, vel faucibus
          lorem nulla vitae metus. Curabitur non tortor fringilla, ornare ex
          quis, bibendum tellus. Integer imperdiet justo a leo pharetra blandit.
          Nam feugiat tempus sollicitudin. Sed semper magna ac eros luctus,
          consectetur interdum diam interdum. Cras varius pellentesque
          facilisis. In id vehicula nibh.
        </p>

        <p>
          Donec eu fringilla nibh, a varius tortor. Duis convallis et nisi vel
          maximus. Etiam vitae massa elit. Sed vestibulum turpis ut fermentum
          ultrices. Aliquam euismod elit vitae pellentesque pulvinar. Integer
          quam neque, sollicitudin luctus eros a, vehicula placerat urna. Cras
          hendrerit, turpis quis hendrerit porta, orci mauris ullamcorper metus,
          id interdum tortor elit vel purus. Curabitur tincidunt, magna vel
          tristique eleifend, quam lectus consectetur ipsum, eget commodo sapien
          neque vel urna. Nunc pretium convallis libero sed sagittis. Vivamus
          mattis blandit congue. Aliquam varius metus at leo fermentum, eu
          condimentum lectus ultricies. In a nisl sit amet nulla eleifend
          gravida. Pellentesque consequat enim sed turpis tempus malesuada.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Contato
        </h2>
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

export default AboutUs;
