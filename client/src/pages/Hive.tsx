import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import{ HIVE_TYPES, FRAME_COUNTS, HIVE_STATUS} from "../constants/index";
import { useNavigate, useParams } from "react-router";

function Hive(){
    const [hive, setHive] = useState<any>({});
    const [visits, setVisits] = useState<any[]>([]);
    const params = useParams();
    const navigate = useNavigate();

    async function fetchHive(){
        try {
            const hiveId = params['hive-id'];
            const response = await axios.get(`/api/hives/${hiveId}`);
            setHive(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    //Fonction pour récupérer les visites de cette ruche
    async function fetchVisits(){
        try {
            const hiveId = params['hive-id'];
            const response = await axios.get(`/api/hives/${hiveId}/visits`);
            setVisits(response.data);
        } catch (error) {
            console.log("Erreur récupération visites:", error);
        }
    }

    useEffect(()=>{
        fetchHive();
        fetchVisits();
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

            {/*Section Historique des visites */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Historique des visites</h2>
                
                {visits.length === 0 ? (
                    <p className="text-gray-500 italic">Aucune visite enregistrée pour cette ruche</p>
                ) : (
                    <div className="space-y-2">
                        {visits.map(visit => {
                            //Fonction pour formater la date
                            const formatDate = (dateString: string) => {
                                const date = new Date(dateString);
                                return date.toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                            };

                            return (
                                <div 
                                    key={visit.id}
                                    onClick={() => {
                                        //Téléchargement PDF fiche de visite
                                        window.open(`http://localhost:3000/api/visits/${visit.id}/pdf`, '_blank');
                                    }}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800">{formatDate(visit.date)}</p>
                                            <p className="text-sm text-gray-600">
                                                {visit.visitActions?.length || 0} action(s) effectuée(s)
                                            </p>
                                        </div>
                                        <div className="text-blue-500 font-bold">
                                            PDF
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
export default Hive;