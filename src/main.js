const { createRoot } = ReactDOM;

// Mount the app
const root = createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <NotificationProvider>
            <DataProvider>
                <App />
            </DataProvider>
        </NotificationProvider>
    </AuthProvider>
);
