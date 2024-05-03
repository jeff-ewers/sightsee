import { useEffect, useState } from 'react';
import { getAllCategories } from '../../services/categoryService'; 
export const POIForm = ({ currentUser, existingPOI, addPlaceToTransientTrip }) => {
 const [categories, setCategories] = useState([]);
 const [editedPOI, setEditedPOI] = useState(existingPOI
  ? {
      ...existingPOI,
      userId: currentUser.id,
    }
  : {
      name: "",
      description: "",
      categoryId: 0,
      userId: currentUser.id,
    }
);
  
  
  
//   {
//     name: existingPOI ? existingPOI.name : "",
//     desc: existingPOI ? existingPOI.desc : "",
//     categoryId: existingPOI ? existingPOI.categoryId : 0,
//     userId: currentUser.id,
//  });

 useEffect(() => {
    setEditedPOI(prevState => ({ ...prevState, userId: currentUser.id }));
 }, [currentUser]);

 useEffect(() => {
    getAllCategories().then((categoriesArray) => {
      setCategories(categoriesArray);
    });
 }, []);

 const handleSave = () => {
    if (editedPOI.categoryId !== 0) {
        const poiToSave = {
          
            ...editedPOI,
            // If editing a poi, keep the existing ID, otherwise set to null
            id: existingPOI ? existingPOI.id : null, 
          };
          addPlaceToTransientTrip(poiToSave)
    }
    else {
        window.alert(`Please select a category.`)
    }
    }


 return (
    <form className="trip-edit__poi-form">
      <h2>{existingPOI ? "Edit Point of Interest" : "Add New Point of Interest"}</h2>
      <fieldset>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={editedPOI.name}
            onChange={(event) => {
              const copy = { ...editedPOI };
              copy.name = event.target.value;
              setEditedPOI(copy);
            }}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="desc"
            value={editedPOI.description}
            onChange={(event) => {
              const copy = { ...editedPOI };
              copy.description = event.target.value;
              setEditedPOI(copy);
            }}
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={editedPOI.categoryId}
            onChange={(event) => {
              const copy = { ...editedPOI };
              copy.categoryId = parseInt(event.target.value);
              setEditedPOI(copy);
            }}
          >
            <option value="0" disabled>Select a category</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.category}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
      <button className="btn-primary" type="button" onClick={handleSave}>Save</button>
    </form>
 );
};
