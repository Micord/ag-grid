/**
 * Find the parent items of the current page within the documentation menu
 */

function sectionHasPath(section, urlPath) {
    if (urlPath === section.url) {
        return true;
    } else if (section.items) {
        return section.items.reduce((acc, sectionItem) => {
            return acc || sectionHasPath(sectionItem, urlPath);
        }, false);
    }
}

function getFullPath(section, urlPath) {
    if (section.items) {
        return section.items.reduce((acc, sectionItem) => {
            const hasUrlPath = sectionHasPath(sectionItem, urlPath);
            let result = acc;

            if (hasUrlPath) {
                const furtherPath = getFullPath(sectionItem, urlPath);

                result = acc.concat(sectionItem).concat(furtherPath);
            }
            return result;
        }, []);
    }

    return [];
}

export function findParentItems(combinedMenuItems, urlPath) {
    let foundPath;
    combinedMenuItems.forEach((section) => {
        if (foundPath) {
            return;
        }

        // Special case for Standalone Charts menu items
        if (section.title === 'Standalone Charts') {
            urlPath = urlPath.replace('/', '/charts-');
        }

        const sectionPath = getFullPath(section, urlPath);
        if (sectionPath.length) {
            foundPath = [section].concat(sectionPath);
        }
    });

    return foundPath || [];
}
