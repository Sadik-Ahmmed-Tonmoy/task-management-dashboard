// import CryptoJS from 'crypto-js';

// const secretKey = 'my-unique-secret-key-007';

// const encrypt = (data: string) => {
//     try {
//         const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
//         return encryptedData;
//     } catch (error) {
//         console.error('Encryption error:', error);
//         throw error; 
//     }
// };

// const decrypt = (encryptedData: string) => {
//     try {
//         if (encryptedData) {
//             const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//             const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

//             return decryptedData;
//         }
//     } catch (error) {
//         console.error('Decryption error:', error);
//         return null;
//     }
// };

// export { encrypt, decrypt };
