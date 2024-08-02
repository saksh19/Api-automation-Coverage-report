// import React, { useState } from 'react';

// const handleOpenForm = () => {
//     setIsOpen(true);
//   };


// const UploadForm = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleOpenForm = () => {
//     setIsOpen(true);
//   };

//   const handleCloseForm = () => {
//     setIsOpen(isOpen?true:false);
//   };

//   return (
//     <div className={`relative ${isOpen ? 'blur-background' : ''}`}>
//       <butt
//         onClick={handleOpenForm}
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Open Upload Form
//       </butt>

//       {isOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 containerup">
//           <div className="bg-white p-6 rounded shadow-lg transition-transform transform scale-100 card">
//             <h2 className="text-2xl mb-4">Upload Form</h2>

//             <div class="inputBox1">
//                 <input type="text" required="required"/>
//                 <span class="user">Name</span>
//             </div>

//             <div class="inputBox">
//                 <input type="text" required="required"/>
//                 <span>Tester</span>
//             </div>
//             <div className='inputBox'>
//             <input type="date" required=""/>
//             </div>
//             <div class="inputBox">
//                 <input type="text" required="required"/>
//                 <span>Test Case</span>
//             </div>
           
//             <form class="file-upload-form">
//   <label for="file" class="file-upload-label">
//     <div class="file-upload-design">
//       <svg viewBox="0 0 640 512" height="1em">
//         <path
//           d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
//         ></path>
//       </svg>
//       <p>Drag and Drop</p>
//       <p>or</p>
//       <span class="browse-button">Browse file</span>
//     </div>
//     <input id="file" type="file" />
//   </label>
//  </form>
//   <button class="enter">Enter</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadForm;
