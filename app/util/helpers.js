//import * as Network from 'expo-network';

export function getLocalIP() {
  return '172.20.10.2';
}


/*
export async function getLocalIP() {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等 1 秒
    const ip = await Network.getIpAddressAsync();
    console.log('Local IP:', ip);
    return '172.20.10.18';
  } catch (error) {
    console.error('Failed to get IP:', error);
    return '127.0.0.1';
  }
}
*/