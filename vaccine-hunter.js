const cron = require('node-cron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const hunt = async () => {
  try {
    const { stdout, stderr } = await exec('sh scripts/hunt.sh');
    const avalible = [];
    if (stdout) {
      const data = JSON.parse(stdout).responsePayloadData.data['NJ'];
      data.forEach(cityData => {
        if (cityData.status !== 'Fully Booked') {
          avalible.push(`City: ${p.city}, Total Available: ${p.totalAvailable}`);
        }
      });
      return avalible;
    }
  } catch (err) {
    console.error(err)
  }
}

cron.schedule('*/15 * * * *', function () {
  console.log('---------------------')
  console.log('Running Hunter')

  // Check Maryland and email
  hunt().then((res) => {
    if (res.length) {
      console.log(res);
      exec('sh scripts/alert.sh');
    }
  })
})

console.log('Vaccine hunter has started');
