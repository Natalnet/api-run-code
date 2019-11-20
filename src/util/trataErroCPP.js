
module.exports = (erroCPP) =>{
	return erroCPP
		.split('\n')
		.filter((s,i) => i<=3)
		.map((s) => {
			if(s.indexOf(': ')!=-1){
				return s.slice(s.indexOf(': ')+2)
			}
			else if(s.indexOf('note: ')!=-1){
				return s.slice(s.indexOf('note: '))
			}
			else if(s.indexOf(':\r')!=-1){
				return s.slice(s.indexOf(':\r'))
			}
			return s
		})
		.join('\n')
}