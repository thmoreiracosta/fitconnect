const BASE_URL = "https://app.base44.com/api/apps/685a9b935e6afc09158ab5c6/entities/Gym";
const API_KEY = "59dae4b7cc784e13ab7ae95cec0c0236";

const Gym = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}?${query}`, {
      headers: {
        "api_key": API_KEY,
        "Content-Type": "application/json",
      }
    });
    if (!res.ok) throw new Error("Erro ao listar academias");
    return await res.json();
  },
  async update(id, data) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "api_key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao atualizar academia");
    return await res.json();
  },
};
export default Gym;