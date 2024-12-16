const UserFooter = () => {
    return (
      <>
        <footer className="du-footer bg-base-200 text-base-content p-10">
          <nav className="bg-base-200">
            <h6 className="du-footer-title">Services</h6>
            <a className="link link-hover" href="#">Branding</a>
            <a className="link link-hover" href="#">Design</a>
            <a className="link link-hover" href="#">Marketing</a>
            <a className="link link-hover" href="#">Advertisement</a>
          </nav>
          <nav className="bg-base-200">
            <h6 className="du-footer-title">Company</h6>
            <a className="link link-hover" href="#">About us</a>
            <a className="link link-hover" href="#">Contact</a>
            <a className="link link-hover" href="#">Jobs</a>
            <a className="link link-hover" href="#">Press kit</a>
          </nav>
          <nav className="bg-base-200">
            <h6 className="du-footer-title">Legal</h6>
            <a className="link link-hover" href="#">Terms of use</a>
            <a className="link link-hover" href="#">Privacy policy</a>
            <a className="link link-hover" href="#">Cookie policy</a>
          </nav>
        </footer>

        <footer className="du-footer bg-base-200 text-base-content border-base-300 border-t px-10 py-4">
          <aside className="grid-flow-col items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-current"
            >
              <path d="M22.672 15.226l-2.432.811..."></path>
            </svg>
            <p>
              ACME Industries Ltd.
              <br />
              Providing reliable tech since 1992
            </p>
          </aside>
          <nav className="md:place-self-center md:justify-self-end bg-base-200">
            <div className="grid grid-flow-col gap-4">
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775..."></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0..."></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667..."></path>
                </svg>
              </a>
            </div>
          </nav>
        </footer>
      </>
    );
  };

  export default UserFooter;
