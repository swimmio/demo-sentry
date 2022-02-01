import * as React from 'react';

import SvgIcon, {SVGIconProps} from './svgIcon';

const IconBoom = React.forwardRef<SVGSVGElement, SVGIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref}>
      <path d="M4.86,15.81A.74.74,0,0,1,4.11,15l.27-3.68L.73,10.76a.73.73,0,0,1-.62-.57A.75.75,0,0,1,.42,9.4L3.47,7.31,1.62,4.11a.75.75,0,0,1,1-1L6.54,5.42,7.34.81A.76.76,0,0,1,8,.19a.74.74,0,0,1,.77.48L10.14,4.1,13.67,3a.76.76,0,0,1,.81.25.76.76,0,0,1,.06.84L12.7,7.31,15.75,9.4a.77.77,0,0,1,.3.82.76.76,0,0,1-.68.55l-4.6.3L12,14.82a.76.76,0,0,1-.31.87.75.75,0,0,1-.92-.08L8.08,13.1,5.37,15.61A.76.76,0,0,1,4.86,15.81Zm-2-6.24,2.46.37a.76.76,0,0,1,.64.8l-.18,2.48,1.82-1.69a.74.74,0,0,1,1,0l1.09,1-.63-1.92a.75.75,0,0,1,.66-1l3.4-.23L11.28,8.16a.76.76,0,0,1-.23-1L12.29,5l-2.38.73A.75.75,0,0,1,9,5.3L8.36,3.7,7.83,6.75a.74.74,0,0,1-.42.56.75.75,0,0,1-.7,0L4.36,5.86l.75,1.31a.74.74,0,0,1-.22,1Z" />
    </SvgIcon>
  );
});

IconBoom.displayName = 'IconBoom';

export {IconBoom};
