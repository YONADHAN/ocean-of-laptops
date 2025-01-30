import Cookie from "js-cookie";

const storeAccessToken = (role, token, expiresInMinutes = 45) => {
    if(!role || !token) {
        console.error("Role and token are required to store the access token.");
        return;
    }
 
    Cookie.set(`access_token`, token, { expires: 7});
    console.log(`${role}_access_token stored successfully with aa ${expiresInMinutes} minute expiry.`);
};
export default storeAccessToken;