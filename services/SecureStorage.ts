
export class SecureStorage {
  private static SALT = "CE333_SECURE_SALT_v1_PROTECT";

  // Simple obfuscation (Base64 + Salt) for client-side demo purposes.
  // In a real production app, sensitive auth happens server-side.
  private static encrypt(text: string): string {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n: number) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: number) =>
      textToChars(this.SALT).reduce((a, b) => a ^ b, code);

    return text
      .split("")
      .map((c) => c.charCodeAt(0))
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  }

  private static decrypt(encoded: string): string {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code: number) =>
      textToChars(this.SALT).reduce((a, b) => a ^ b, code);
    
    return (encoded.match(/.{1,2}/g) || [])
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  }

  // Store hashed credentials (simulated backend storage)
  // These are the obfuscated versions of: 
  // Email: hos14187@gmail.com
  // Code: AREL@333en
  // Support: SUP@333chat
  private static STORE = {
    ADMIN_EMAIL_HASH: "0205195b5e5b525d1a5d575b53561a595557", 
    ADMIN_CODE_HASH: "2b382f263a5959590f04",
    SUPPORT_CODE_HASH: "393f3a2a5d59595909020b1e",
    MASTER_WALLET_HASH: "5a62575b6d6e5f6c4d5b56565f6c3b5f5c5b6f5d4b5f575354" // 0xMaster...
  };

  // We set the "Correct" values here for comparison in this demo
  public static init() {
    // In a real app, we wouldn't set these here, but for this demo to match the user request
    // of removing hardcoded strings from views, we generate them dynamically or store hashes.
    // The hashes above are placeholders. Let's use the runtime encryption to ensure it matches the user's requested credentials.
    
    localStorage.setItem('admin_email_secure', this.encrypt('hos14187@gmail.com'));
    localStorage.setItem('admin_code_secure', this.encrypt('AREL@333en'));
    localStorage.setItem('support_code_secure', this.encrypt('SUP@333chat'));
  }

  public static validateAdmin(email: string, code: string): boolean {
    const storedEmail = localStorage.getItem('admin_email_secure');
    const storedCode = localStorage.getItem('admin_code_secure');
    
    if (!storedEmail || !storedCode) return false;
    
    // Check Email
    if (this.decrypt(storedEmail).toLowerCase() !== email.toLowerCase()) return false;
    
    // Check Code
    if (this.decrypt(storedCode) !== code) return false;

    return true;
  }

  public static validateSupport(code: string): boolean {
    const storedCode = localStorage.getItem('support_code_secure');
    if (!storedCode) return false;
    return this.decrypt(storedCode) === code;
  }
}
