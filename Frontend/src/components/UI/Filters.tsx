const Filters = () => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <form>
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="Continents filter"
        />
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="Counteries filter"
        />
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="skills filter"
        />
        <input className="btn btn-square" type="reset" value="×" />
      </form>
    </div>
  );
};

export default Filters;
