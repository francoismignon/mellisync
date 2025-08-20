import axios from "axios";
import { useEffect, useState } from "react";
import{ HIVE_TYPES, FRAME_COUNTS, HIVE_STATUS} from "../constants/index";
import { useNavigate, useParams } from "react-router";

function Hive(){
    const [hive, setHive] = useState({});
    const params = useParams();
    const navigate = useNavigate();

    async function fetchHive(){
        try {
            const hiveId = params['hive-id'];
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/hives/${hiveId}`);
            setHive(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchHive();
    }, []);

    return(
        <div>
            <h1>{hive.name}</h1>
            <h1>{hive.color}</h1>
            {/* On utilise une IIFE (Immediately Invoked Function Expression) pour exécuter du code inline.
            On cherche le bon type avec .find() dans HIVE_TYPES, puis on affiche son label
            (via opérateur ternaire ou short-circuit pour éviter une erreur si non trouvé). */}
            <h1>
                {
                    (()=>{
                        const objt = HIVE_TYPES.find(type => type.value === hive.type); 
                        return objt && objt.label;
                    })()
                }
            </h1>
            {/* On utilise .find() pour récupérer l’objet correspondant, et ?. (optional chaining) pour afficher son label uniquement s’il existe. */}
            <h1>{FRAME_COUNTS.find(frame => frame.value === hive.framecount)?.label}</h1>
            <h1>{HIVE_STATUS.find(status => status.value === hive.status)?.label}</h1>
            <input 
                type="button" 
                value="Ajouter une visite"
                className="border"
                onClick={()=> {
                    navigate(`/ruchers/${params['apiary-id']}/ruches/${params['hive-id']}/visites/nouvelle`);
                }} />
        </div>
    );
}
export default Hive;