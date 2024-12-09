const membershipFileInput = document.getElementById("membershipFileInput");
const checkFileInput = document.getElementById("checkFileInput");
const compareButton = document.getElementById("compareButton");
const copyButton = document.getElementById("copy");
const resultDiv = document.getElementById("result");

copyButton.addEventListener("click", () => {
  const emails = resultDiv.innerText;
  navigator.clipboard.writeText(emails);
});
compareButton.addEventListener("click", () => {
  const membershipFile = membershipFileInput.files[0];
  const checkFile = checkFileInput.files[0];

  if (!membershipFile || !checkFile) {
    resultDiv.textContent = "Please select two CSV files.";
    return;
  }

  const membershipReader = new FileReader();
  const checkReader = new FileReader();

  membershipReader.onload = (event) => {
    const csv1 = event.target.result;
    const membershipData = parseCSV(csv1);
    const migs = membershipData.filter(
      (m) => m.membership_status == "Member in Good Standing"
    );
    const migsEmails = migs
      .map((m) => m.email)
      .filter((email) => !!email && email.trim() != "");

    console.log(migsEmails);

    checkReader.onload = (event) => {
      const csv2 = event.target.result;
      const checkData = parseCSV(csv2);
      console.log(checkData);

      const checkMigs = checkData.filter((r) =>
        migsEmails.includes(r["email"] || r["Email"])
      );

      console.log(checkMigs);
      const emails = Array.from(
        new Set(checkMigs.map((r) => r["email"] || r["Email"]))
      );
      resultDiv.innerText = emails.join("\n");
    };

    checkReader.readAsText(checkFile);
  };

  membershipReader.readAsText(membershipFile);
});

function parseCSV(csvString) {
  const lines = csvString.split("\n");
  const headers = lines[0].split(",");
  const rows = [];
  lines.slice(1).forEach((line) => {
    const row = line.split(",").map((value, index) => [headers[index], value]);
    rows.push(Object.fromEntries(row));
  });
  return rows;
}