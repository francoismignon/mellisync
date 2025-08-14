import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function NewApiary() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/apiaries`,
        formData
      );
      //console.log(response.data);
      navigate(`/ruchers/${response.data.apiary.id}`); // si OK, renvoye vers la pages de liste de ruchers
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }
  return (
    <div>
      <h1>Formulaire de creation de rucher</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="border"
          name="name"
          placeholder="ex:Rucher des Lilas"
          onChange={handleChange}
          value={formData.name}
        />
        <input
          className="border"
          type="text"
          name="address"
          placeholder="ex: Rue de Melli"
          onChange={handleChange}
          value={formData.address}
        />
        <input
          className="border"
          type="text"
          name="city"
          placeholder="ex: boussu"
          onChange={handleChange}
          value={formData.city}
        />
        <input type="submit" value="Ajouter rucher" className="border" />
      </form>
    </div>
  );
}
export default NewApiary;
