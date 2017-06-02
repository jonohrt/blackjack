let g:neoformat_javascript_prettierstandard = {
            \ 'exe': 'node_modules/.bin/prettier-standard',
            \ 'stdin': 1
            \}
let g:neoformat_enabled_javascript = [ 'prettierstandard']

autocmd BufWritePre *.js Neoformat
