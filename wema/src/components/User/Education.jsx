function Education() {
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Insurance Education for Beginners</h3>
      </div>
      <div className="d-flex justify-content-center"></div>
      <hr />
      <div className="educationDisplay">
        <div className="p-3 d-flex flex-column">
          <h5>
            Policy: <span className="profileText">an insurance product.</span>
          </h5>
          <br />
          <h5>
            Premium:{' '}
            <span className="profileText">
              the amount of money you pay to buy an insurance product or to keep
              it active
            </span>
          </h5>
          <br />
          <h5>
            Allocation:{' '}
            <span className="profileText">
              {' '}
              the amount of money given to product buyers after the premium has
              been paid. This is
              <br /> for medicine and other health-related expenses. It has a
              limit.
            </span>
          </h5>
          <br />
          <h5>
            Balance:{' '}
            <span className="profileText">
              {' '}
              the amount of money left after partlly or wholly consuming the
              allocation provided by
              <br />a specific insurance company.
            </span>
          </h5>
          <br />
          <h5>
            Claim:{' '}
            <span className="profileText">
              a bill/invoice submitted by your doctor&apos;s office to your
              health insurance company after you
              <br />
              receive medical care.
            </span>
          </h5>
          <br />
          <h5>
            Benefits:{' '}
            <span className="profileText">
              the services that are included in the insurance product package.
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Education;
