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
      </div>
    </Layout>
  );
};

export default AboutUs;
