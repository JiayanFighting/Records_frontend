/**
 * parse user's name
 * @method parseName
 * @for Main
 * @param name
 * @return parsed name
 */
export function parseName(name){

    // use fake name instead if undefined
    if (name === undefined) {

        return "";
    }

    //else parse name
    return name.charAt(0) + name.charAt(name.indexOf(' ') + 1)
};