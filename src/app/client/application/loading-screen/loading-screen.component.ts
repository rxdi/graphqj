
export class LoadingScreenComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const element = document.createElement('div');
    element.id = 'loader';
    element.innerHTML = `
      <style>
        #loader {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 1;
          width: 150px;
          height: 150px;
          margin: -75px 0 0 -75px;
          border: 16px solid #f3f3f3;
          border-radius: 50%;
          border-top: 16px solid #3498db;
          width: 120px;
          height: 120px;
          -webkit-animation: spin 2s linear infinite;
          animation: spin 2s linear infinite;
        }
        @-webkit-keyframes spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-bottom {
          position: relative;
          -webkit-animation-name: animatebottom;
          -webkit-animation-duration: 1s;
          animation-name: animatebottom;
          animation-duration: 1s;
        }

        @-webkit-keyframes animatebottom {
          from {
            bottom: -100px;
            opacity: 0;
          }
          to {
            bottom: 0px;
            opacity: 1;
          }
        }

        @keyframes animatebottom {
          from {
            bottom: -100px;
            opacity: 0;
          }
          to {
            bottom: 0;
            opacity: 1;
          }
        }

      </style>
    `;
    shadow.append(element);
  }
}

customElements.define('loading-screen-component', LoadingScreenComponent);
