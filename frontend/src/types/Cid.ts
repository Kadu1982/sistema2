/**
 * Interface representing a CID (International Classification of Diseases) code
 */
export interface Cid {
    /**
     * The CID code (e.g., "A09")
     */
    codigo: string;
    
    /**
     * The description of the disease or condition
     */
    descricao: string;
}

/**
 * Helper function to format a CID for display
 * @param cid The CID object
 * @returns A formatted string with code and description
 */
export const formatarCid = (cid: Cid): string => {
    return `${cid.codigo} - ${cid.descricao}`;
};