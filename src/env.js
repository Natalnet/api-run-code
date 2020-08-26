const path = require('path')

module.exports = {
	//URL_GCC : process.env.URL_GCC || path.normalize('C:/Program Files (x86)/CodeBlocks/MinGW/bin/gcc.exe')
	URL_GPP : '/usr/bin/g++',
	URL_GCC : '/usr/bin/gcc',
	URL_PYTHON : process.env.URL_PYTHON
}
