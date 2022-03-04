/**
 * Save given data as a file on disk. When working with Blob URLs
 * you can revoke these immediately after this invocation to free resources.
 *
 * @param {String} data as String, base64 encoded content
 * @param {String} fileName name of file
 */
export const saveAsFile = ( data: string, fileName: string ): void => {
    const anchor  = document.createElement( "a" );
    anchor.style.display = "none";
    anchor.href = data;
    anchor.setAttribute( "download", fileName );

    // Safari has no download attribute
    if ( typeof anchor.download === "undefined" ) {
        anchor.setAttribute( "target", "_blank" );
    }
    document.body.appendChild( anchor );
    anchor.click();
    document.body.removeChild( anchor );
};
