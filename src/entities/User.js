const BASE_URL = "https://app.base44.com/api/apps/685a9b935e6afc09158ab5c6/entities/User";
const API_KEY = "59dae4b7cc784e13ab7ae95cec0c0236";

const User = {
  async me() {
    // Busca o primeiro usuário como exemplo. Se quiser buscar pelo e-mail, adicione o filtro.
    const res = await fetch(`${BASE_URL}?limit=1`, {
      headers: {
        "api_key": API_KEY,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Erro ao buscar usuário");
    const users = await res.json();
    return users[0]; // Retorna o primeiro usuário encontrado
  },

  async updateMyUserData(data) {
    const me = await User.me();
    if (!me?.id) throw new Error("Usuário não encontrado");
    const res = await fetch(`${BASE_URL}/${me.id}`, {
      method: "PUT",
      headers: {
        "api_key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erro ao atualizar usuário");
    return await res.json();
  }
};

export default User;