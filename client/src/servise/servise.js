import axiosInstance from "./axios"

export const appservice = {


    async loginWithGoogle(token) {
        const response = await axiosInstance.post('/auth/google-login', {
            token
        })
        return response
    },

    async logout() {
        const response = await axiosInstance.get('/auth/logout')
        return response
    },
    async generateEmail({ subjectPrompt, bodyPrompt, tone }){
        const response = await axiosInstance.post('/email/generate', {
            subjectPrompt,
            bodyPrompt,
            tone
        })
        return response
    },

    async sendEmail({ recipients, subject, body, tone }) {
        const googleAccessToken = localStorage.getItem("googleAccessToken")
        const response = await axiosInstance.post('/email/send', {
            recipients,
            subject,
            body,
            tone,
            googleAccessToken
        })
        return response
    },

    async getSentEmails() {
        const response = await axiosInstance.get('/email/sent')
        return response
    }

}