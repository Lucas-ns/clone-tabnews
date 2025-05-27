import bcryptjs from "bcryptjs";

const pepper = "thisispepper";
async function hash(password) {
  const rounds = getNumberOfRounds();
  password += pepper;
  return await bcryptjs.hash(password, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword + pepper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
