export class ConnectApi {
  constructor(private apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async get<T>(endpoint: string): Promise<void | T> {
    try {
      const response = await fetch(this.apiUrl + endpoint);

      if (!response.ok) throw new Error("something went wrong...");

      return await response.json();
    } catch (e) {
      console.log(e);
    }
  }
}
