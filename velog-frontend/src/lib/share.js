// @flow
export const shareFacebook = (href: string) => {
  window.FB.ui({
    method: 'share',
    mobile_iframe: true,
    href,
  });
};

export const shareTwitter = (href: string, text: string) => {
  window.open(
    `https://twitter.com/share?url=${encodeURI(href)}&text=${text}&hashtags=velog`,
    'sharer',
    'toolbar=0,status=0,width=626,height=436',
  );
};
