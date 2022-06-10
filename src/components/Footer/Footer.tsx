import React from "react";

export const Footer = () => (
  <footer>
    <div className="row">
      <div className="column">
        <img
          src="assets/images/logo-bmbf.svg"
          className="logo"
        />
      </div>
      <div className="column">
        <img
          src="assets/images/logo-okfn.svg"
          className="logo"
        />
      </div>
      <div className="column">
        <img
          src="assets/images/signature_sign2.png"
          className="signature"
          alt="Web2.0"
        />
        <p>
          <strong>fullscreen</strong> <br /> may 2022{" "}
        </p>
      </div>
      <div className="column">
        <p> codebase </p> <p> impressum </p>
      </div>
    </div>
  </footer>
);
