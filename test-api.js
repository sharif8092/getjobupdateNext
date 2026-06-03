const fetch = require('node-fetch');

async function check() {
  const url = 'https://api.getjobupdate.co.in/wp-json/wp/v2/aziz_job?search=Telangana+AEE+Civil&_fields=id,slug,custom_meta,title';
  console.log('Fetching', url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.error(e);
  }
}
check();
