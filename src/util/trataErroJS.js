module.exports = erroJs =>{
	return  erroJs.split('\n')
		.filter((s,i) => i>=1 && i<=4)
		.join('\n')
}