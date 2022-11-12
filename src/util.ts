import {useRouter} from "next/router";

export function getURL() {
    const router = useRouter();
    const {hrefs} = router.query;

    let href: string;
    if (typeof hrefs === 'undefined') {
        href = "";
    } else if (typeof hrefs === 'string') {
        href = hrefs;
    } else {
        href = hrefs[0];
    }

    return new URL(href);
}