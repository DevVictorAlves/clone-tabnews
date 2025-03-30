import retry from 'async-retry'

const URL_REQUEST = 'http://localhost:3000/api/v1/status'

export async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    await retry(fetchStatusPage, {retries: 100, maxTimeout: 1000});

    async function fetchStatusPage() {
      const response = await fetch(URL_REQUEST);
      if (!response.ok) {
        throw new Error(`HTTP ERROR status ${response.status}`);
      }
    }
  }
}

export default {
  waitForAllServices
}