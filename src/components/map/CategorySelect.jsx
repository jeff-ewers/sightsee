export const CategorySelect = ({placeCategory, setPlaceCategory}) => {
    
    const handleCategoryChange = (event) => {
        setPlaceCategory(event.target.value);
        };
    
    return (<div style={{
        position: 'absolute',
        top: '50px',
        right: '10px',
        backgroundColor: 'rgb(59, 59, 59, 0.5)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        color: 'var(--offWhite)',
        fontFamily: "Nunito"
      }}>
        <label htmlFor="placeCategory">Category: </label>
        <select id="placeCategory" value={placeCategory} onChange={handleCategoryChange}>
          <option value="hotels">Hotels</option>
          <option value="attractions">Attractions</option>
          <option value="restaurants">Restaurants</option>
        </select>
      </div>)
}