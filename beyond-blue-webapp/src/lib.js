export const formatDate = (dateToFormat) => {
    if (dateToFormat == null) {
        return ""
    }
    var dd = String(dateToFormat.getDate()).padStart(2, '0')
    var mm = String(dateToFormat.getMonth() + 1).padStart(2, '0')
    var yyyy = dateToFormat.getFullYear()

    return mm + '/' + dd + '/' + yyyy
}