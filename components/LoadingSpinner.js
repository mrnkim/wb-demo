import clsx from 'clsx';

function getSize(size) {
	switch (size) {
		case 'sm':
			return 'w-4 h-4';
		case 'md':
			return 'w-5 h-5';
		default:
			throw new Error(`Invalid size prop: ${size}`);
	}
}

function getColor(color) {
	switch (color) {
		case 'default':
			return 'border-grey-500';
		case 'primary':
			return 'border-primary';
		default:
			throw new Error(`Invalid color prop: ${color}`);
	}
}

const LoadingSpinner = ({ className, size = 'sm', color = 'default', ...props }) => (
	<div
		className={clsx(
			getSize(size),
			getColor(color),
			'rounded-full border-2 border-solid border-t-transparent',
			'animate-spin',
			className
		)}
		{...props}
	/>
);

export default LoadingSpinner;
