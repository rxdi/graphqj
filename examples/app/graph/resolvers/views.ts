// eslint-disable-next-line @typescript-eslint/no-var-requires
const { html, renderToString } = require('@popeindustries/lit-html-server');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function foobar(root, payload, context, info) {
  return {
    doctor: await renderToString(html`
      <p style="border: 1px solid black; background-color: aquamarine;">
        I am a doctor22 dada
      </p>
    `),
    patient: await renderToString(html`
      <p style="border: 1px solid black; background-color: aquamarine;">
        I am a patient
      </p>
    `),
    registrator: await renderToString(html`
      <p style="border: 1px solid black; background-color: aquamarine;">
        I am a registrator
      </p>
    `),
    aboutwithloading: await renderToString(html`
      <p style="border: 1px solid black; background-color: aquamarine;">
        I am a dadadaad
      </p>
    `),
  };
}
